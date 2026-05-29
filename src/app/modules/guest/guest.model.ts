import { Schema, model } from 'mongoose';
import { GuestModel, TGuest } from './guest.interface';

const guestSchema = new Schema<TGuest, GuestModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'User ID reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    passportNumber: {
      type: String,
      required: [true, 'Passport number is required'],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Filter out deleted guests automatically
guestSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

guestSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Guest = model<TGuest, GuestModel>('Guest', guestSchema);
