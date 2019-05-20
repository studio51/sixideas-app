import { Like } from './like';
import { Tag } from './tag';

export interface User {
  _id: {
    $oid: string
  };

  // Details
  //
  forename: string;
  surname: string;
  bio: string;
  name: string;
  username: string;
  email: string;
  initials: string;

  // ...
  //
  password: string;
  password_confirmation: string;

  // Preferences
  //
  colour: string;
  avatar_id: string;
  avatar_url: string;
  profile_banner_id: string;
  profile_banner_url: string;

  // Associations
  //
  interests: string[];

  like_ids: string[];
  tag_ids: string[];
  follower_ids: string[];
  following_ids: string[];

  like_count: number;
  tag_count: number;
  follower_count: number;
  following_count: number;

  likes: Like[];
  tags: Tag[];
  following: User[];
  followers: User[];
}

export interface UserResponse {
  users: User[],
  total_users: number
}

export class User {
  constructor(fields: any) {
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
  }
}