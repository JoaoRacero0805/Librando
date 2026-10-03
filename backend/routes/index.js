// * imports
const express = require('express');
const router = express.Router();
const {
  rootController,
  registerController,
  loginController,
  userController,
  addQuestController,
  getUserQuestsController,
  updateStreak
} = require('../controllers');

// * rotas

router.get('/', rootController);
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/user/:id/quest', addQuestController);
router.get('/user/:id/quests', getUserQuestsController);
router.get('/user/:id', userController);
router.post('/update-streak/:id', updateStreak)

// * export
module.exports = router;
