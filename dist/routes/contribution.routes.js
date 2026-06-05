"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contribution_controller_1 = require("../controllers/contribution.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/my-contributions', auth_middleware_1.authenticateJWT, contribution_controller_1.getUserContributions);
exports.default = router;
