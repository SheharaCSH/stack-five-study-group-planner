const express = require('express');
const { createGroup, getGroups, getGroup, updateGroup, deleteGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getGroups).post(protect, createGroup);
router.route('/:id').get(getGroup).put(protect, updateGroup).delete(protect, deleteGroup);

module.exports = router;