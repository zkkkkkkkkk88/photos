export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  province: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
  category: '美食' | '景点' | '生活照' | '史迪奇' | '一二布布' | '花' | '其他';
  tags: string[];
  rating: number;
  created_at: string;
  profile?: Profile;
}

export type ProvinceStats = {
  province: string;
  count: number;
};

export type CategoryStats = {
  category: string;
  count: number;
};

export interface Stats {
  totalProvinces: number;
  totalPhotos: number;
  topCategory: string;
  myCount: number;
  taCount: number;
  provinceRanking: ProvinceStats[];
}

export type NewPhoto = Omit<Photo, 'id' | 'created_at' | 'profile' | 'image_url'> & {
  image_url?: string;
};
