// * imports
const { User } = require('../models/userModel');
const mongoose = require('mongoose');

// * controllers
function rootController(req, res) {
  res.status(200).json({ msg: 'Bem vindo a API!' });
}

async function registerController(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({
      msg: 'Certifique que os campos name, email e password foram enviados.',
    });
  }
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' });
  } else {
    const user = new User({
      name,
      email,
      password,
    });
    try {
      await user.save();
      res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ msg: 'Certifique que os campos email e password foram enviados.' });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ msg: 'Usuário não encontrado!' });
  }

  if (password !== user.password) {
    return res.status(422).json({ msg: 'Senha inválida!' });
  }

  try {
    const data = {
      id: user._id,
    };
    res.status(200).json({ msg: 'Autenticação e email validados com sucesso', data });
  } catch (err) {
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
  }
}

async function userController(req, res) {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido!' });
  }

  const user = await User.findById(id, '-password -__v');

  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }

  res.status(200).json({ user });
}

async function addQuestController(req, res) {
  const { id } = req.params; // ID do usuário
  const { key, value } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID de usuário inválido!' });
  }

  if (!key || typeof value !== 'boolean') {
    return res.status(422).json({ msg: 'Envie os campos key (string) e value (boolean).' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    // Verifica se já existe uma quest com a mesma key
    const questExists = user.quests.find(q => String(q.key) === String(key));
    if (questExists) {
      return res.status(409).json({ msg: 'Essa quest já existe para o usuário!' });
    }

    // Adiciona a quest
    user.quests.push({ key, value });

    // --- LÓGICA DA OFENSIVA (STREAK) INTEGRADA AQUI ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia

    const lastCheck = user.streak.lastCheck ? new Date(user.streak.lastCheck) : null;
    if (lastCheck) {
      lastCheck.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia
    }

    // ✅ Só atualiza a ofensiva se for a primeira atividade do dia
    if (!lastCheck || lastCheck.getTime() < today.getTime()) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Verifica se a última atividade foi ontem para continuar a ofensiva
      if (lastCheck && lastCheck.getTime() === yesterday.getTime()) {
        user.streak.current += 1;
      } else {
        // Se não foi ontem ou se é a primeira vez, a ofensiva vai para 1
        user.streak.current = 1;
      }

      // Atualiza a melhor ofensiva (best) se a atual for maior
      if (user.streak.current > user.streak.best) {
        user.streak.best = user.streak.current;
      }

      // Salva a data da atividade de hoje
      user.streak.lastCheck = new Date();
    }
    // --- FIM DA LÓGICA DA OFENSIVA ---

    await user.save(); // Salva a quest e a ofensiva de uma só vez

    res.status(201).json({
      msg: 'Quest adicionada com sucesso!',
      quests: user.quests,
      streak: user.streak // Retorna a ofensiva atualizada
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
  }
}

async function getUserQuestsController(req, res) {
  const { id } = req.params; // ID do usuário

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID de usuário inválido!' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    res.status(200).json({ quests: user.quests, ofensive: user.streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
  }
}

async function updateStreak(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID de usuário inválido!' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    // Lógica para atualizar a streak
    const today = new Date();
    const lastCheck = user.streak.lastCheck ? new Date(user.streak.lastCheck) : null;

    let current = user.streak.current || 0;
    let best = user.streak.best || 0;

    if (!lastCheck) {
      // primeira vez
      current = 1;
      best = 1;
      user.streak.lastCheck = today;
    } else {
      // checa se é um novo dia
      const isSameDay =
        today.getFullYear() === lastCheck.getFullYear() &&
        today.getMonth() === lastCheck.getMonth() &&
        today.getDate() === lastCheck.getDate();

      if (!isSameDay) {
        // novo dia → incrementa streak
        current += 1;

        if (current > best) best = current;

        // atualiza o último check
        user.streak.lastCheck = today;
      }
    }

    user.streak.current = current;
    user.streak.best = best;

    await user.save();

    res.json({ message: "Streak atualizada", streak: user.streak });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar streak" });
  }
}

// * exports
module.exports = {
  rootController,
  registerController,
  loginController,
  userController,
  addQuestController,
  getUserQuestsController,
  updateStreak,
};
