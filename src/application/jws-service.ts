import jwt from 'jsonwebtoken'
import {UserDBType} from "../types/user-type";
import {ObjectId} from "mongodb";
import {settings} from "../settings";

export const jwsService = {
    async createJWT(user: UserDBType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '720h'})
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}