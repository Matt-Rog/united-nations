"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.isAuthenticated = void 0;
const lodash_1 = require("lodash");
const users_1 = require("../db/users");
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies["UNITED-NATIONS-AUTH"];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const user = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            return res.sendStatus(403);
        }
        (0, lodash_1.merge)(req, { identity: user });
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isAuthenticated = isAuthenticated;
const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = (0, lodash_1.get)(req, "identity._id");
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() !== id) {
            return res.status(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isOwner = isOwner;
//# sourceMappingURL=index.js.map