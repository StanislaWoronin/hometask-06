import {commentsCollection, postsCollection} from "./db";
import {CommentBDType, CommentsType, CommentType} from "../types/comment-type";
import {commentBDtoCommentType, giveSkipNumber} from "../helperFunctions";

export const commentsRepository = {
    async createNewComment(newComment: CommentBDType): Promise<CommentBDType | null> {
        try {
            await commentsCollection.insertOne(newComment)
            return newComment
        } catch (e) {
            return null
        }
    },

    async updateComment(id: string, comment: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set:{content: comment}})

        return result.matchedCount === 1
    },

    async giveCommentById(id: string): Promise<CommentBDType | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: false}})
    },

    async giveComments(sortBy: string,
                       sortDirection: 'asc' | 'desc',
                       pageNumber: string,
                       pageSize: string,
                       postId: string | undefined): Promise<CommentsType> {

        return await commentsCollection
            .find({postId: postId})
            .sort(sortBy, sortDirection === 'asc' ? 1 : -1)
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .toArray()
    },

    async giveTotalCount(postId: string | undefined): Promise<number> {
        return await commentsCollection.countDocuments({postId: postId}) //
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})

        return result.deletedCount === 1
    },

    async deleteAllComments(): Promise<boolean> {
        try {
            await commentsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('commentsCollection => deleteAllComments =>', e)
            return false
        }
    }
}