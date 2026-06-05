"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroups = exports.joinGroup = exports.createGroup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createGroup = async (req, res, next) => {
    try {
        const { offerId } = req.body;
        const offer = await prisma_1.default.offer.findUnique({ where: { id: offerId } });
        if (!offer)
            return res.status(404).json({ success: false, message: 'Offer not found' });
        const group = await prisma_1.default.group.create({
            data: {
                offerId,
                status: 'OPEN',
                currentSize: 1, // the creator connects automatically
            }
        });
        // Automatically add the creator as a contributor
        await prisma_1.default.contribution.create({
            data: {
                groupId: group.id,
                userId: req.user.id,
                status: 'COMPLETED'
            }
        });
        res.status(201).json({ success: true, group });
    }
    catch (error) {
        next(error);
    }
};
exports.createGroup = createGroup;
const joinGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const group = await prisma_1.default.group.findUnique({ where: { id }, include: { offer: true, contributions: true } });
        if (!group)
            return res.status(404).json({ success: false, message: 'Group not found' });
        if (group.status !== 'OPEN') {
            return res.status(400).json({ success: false, message: 'Group is no longer open' });
        }
        const alreadyJoined = group.contributions.some((c) => c.userId === userId);
        if (alreadyJoined) {
            return res.status(400).json({ success: false, message: 'User already in group' });
        }
        await prisma_1.default.contribution.create({
            data: {
                groupId: id,
                userId,
                status: 'COMPLETED',
            }
        });
        const currentSize = group.currentSize + 1;
        let status = group.status;
        if (currentSize >= group.offer.requiredGroupSize) {
            status = 'UNLOCKED';
        }
        const updatedGroup = await prisma_1.default.group.update({
            where: { id },
            data: { currentSize, status }
        });
        res.status(200).json({ success: true, group: updatedGroup });
    }
    catch (error) {
        next(error);
    }
};
exports.joinGroup = joinGroup;
const getGroups = async (req, res, next) => {
    try {
        const groups = await prisma_1.default.group.findMany({ include: { offer: true, contributions: true } });
        res.status(200).json({ success: true, groups });
    }
    catch (error) {
        next(error);
    }
};
exports.getGroups = getGroups;
