import { Comment } from '../models/comment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { isValidObjectId } from 'mongoose';

/**
 * Retrieves comments associated with a specific post.
 */
const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!postId?.trim() || !isValidObjectId(postId)) {
    throw new ApiError(400, 'postId missing or invalid postId format.');
  }

  const comments = await Comment.find({ post: postId })
    .skip((page - 1) * limit)
    .limit(limit);

  // Get the total count of comments (useful for pagination)
  const commentsCount = await Comment.countDocuments({ post: postId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalPages: Math.ceil(commentsCount / limit),
      },
      'Comments fetched successfully.'
    )
  );
});

/**
 * Adds a new comment to a post.
 */
const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId?.trim() || !isValidObjectId(postId)) {
    throw new ApiError(400, 'postId missing or invalid postId format.');
  }

  const { content } = req.body;
  // Validate required fields (title and content)
  if (!content) {
    throw new ApiError(400, 'All field are required!');
  }

  // Create a new Comment record
  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: postId,
  });

  // Retrieve the published post from the database
  const publishedComment = await Comment.findById(comment._id);

  if (!publishedComment) {
    throw new ApiError(500, 'Something went wrong while publishing comment.');
  }

  // Respond with a success status and the published comment details
  return res
    .status(201)
    .json(
      new ApiResponse(200, publishedComment, 'Comment published successfully.')
    );
});

/**
 * Updates an existing comment.
 */
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId?.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, 'commentId missing or invalid commentId format.');
  }

  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, 'All field are required!');
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment updated successfully.'));
});

/**
 * Deletes a comment.
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId?.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, 'commentId missing or invalid commentId format.');
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(500, 'Comment not found.');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment deleted successfully.'));
});

export { getPostComments, addComment, updateComment, deleteComment };
