export const isAuthenticated = next => (root, args, context, info) => {
    if (!context.req.session.username) throw new Error('User is not authenticated.');
    return next(root, args, context, info);
};



