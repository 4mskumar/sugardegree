

import mongoose, {Schema, Document} from 'mongoose'

export interface IImage extends Document {
    title: string;
    status: 'pending' | 'approved' | 'rejected';    
    imageUrl : string;
    createdAt: Date;
    tags: string[],
    likes: number;
    visible: Boolean
}

const imageSchema: Schema = new Schema<IImage>({
    title: {
        type: String,
        // required: true,
        default: ''
    },
    status: {
        default: 'pending',
        type: String,
        enum: ['pending', 'approved', 'rejected']
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tags: {
        type: [String],
        default: [],
    },
    likes : {
        type : Number,
        default : 0
    },
    visible: {
        type: Boolean,
        default: true,
      },
})

export const Image = mongoose.model<IImage>('Image', imageSchema)