const StudyGroup = require('../models/StudyGroup');

const canModify = (group, user) =>
  user.role === 'admin' || group.createdBy.toString() === user._id.toString();

exports.createGroup = async (req, res) => {
  try {
    const { name, course, description, location, meetingTime, maxMembers } = req.body;
    const group = await StudyGroup.create({
      name, course, description, location, meetingTime, maxMembers,
      createdBy: req.user._id, members: [req.user._id]
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('createdBy', 'name email').populate('members', 'name email');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: 'Invalid group id' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!canModify(group, req.user)) return res.status(403).json({ message: 'Not allowed to edit this group' });
    ['name', 'course', 'description', 'location', 'meetingTime', 'maxMembers'].forEach(f => {
      if (req.body[f] !== undefined) group[f] = req.body[f];
    });
    res.json(await group.save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!canModify(group, req.user)) return res.status(403).json({ message: 'Not allowed to delete this group' });
    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid group id' });
  }
};