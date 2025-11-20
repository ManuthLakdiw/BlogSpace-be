import mongoose, {Document,Schema} from "mongoose";


export interface IPost extends Document{
    _id: mongoose.Types.ObjectId
    title: string
    content: string
    author : mongoose.Types.ObjectId
    imageURL?: string
    tags?: string[]
    createdAt: Date
    updatedAt: Date
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}

const post = new Schema<IPost>(
    {
        title:{type:String, required:true},
        content:{type: String, required:true},
        author: {type: Schema.Types.ObjectId, required: true, ref: "User"},
        imageURL: {type: String, required:true},
        tags: [String],
    },
    {
        timestamps:true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

post.virtual('formattedCreatedAt').get(function() {
    return this.createdAt?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
});

post.virtual('formattedUpdatedAt').get(function() {
    return this.updatedAt?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
})

export const Post = mongoose.model<IPost>("Post", post)