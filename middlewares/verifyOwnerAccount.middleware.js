export const verifyOwnerAccount = (req, res, next) => {
  const loggedInUserId = req.user.user_id;
  const userIdToUpdate = req.params.id;

  if (loggedInUserId === userIdToUpdate) {
    return next();
  }

  return res
    .status(403)
    .json({ message: 'You are not authorized to update this user.' });
};
