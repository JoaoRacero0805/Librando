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
    await user.save();

    res.status(201).json({ msg: 'Quest adicionada com sucesso!', quests: user.quests });
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
    const user = await User.findById(id, 'quests'); // só retorna as quests
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    res.status(200).json({ quests: user.quests });
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
    const today = new Date();
    const lastCheck = user.streak.lastCheck || null;

    let current = user.streak.current || 0;
    let best = user.streak.best || 0;

    if (lastCheck) {
      const diffDays = Math.floor((today - lastCheck) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // manteve a ofensiva
        current += 1;
      } else if (diffDays > 1) {
        // perdeu a ofensiva
        current = 1; // começa de novo no dia atual
      }
      // se diffDays === 0 → já contou hoje, não faz nada
    } else {
      // primeira vez
      current = 1;
    }

    // atualiza best
    if (current > best) best = current;

    // salva no banco
    user.streak = {
      current,
      best,
      lastCheck: today
    };

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
