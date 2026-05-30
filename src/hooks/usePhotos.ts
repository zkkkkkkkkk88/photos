import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Photo, NewPhoto } from '../types';
import { useAuth } from './useAuth';

// Get photos for a specific province
export function useProvincePhotos(province: string | null) {
  return useQuery({
    queryKey: ['photos', 'province', province],
    queryFn: async (): Promise<Photo[]> => {
      if (!province) return [];
      const { data, error } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .eq('province', province)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
    enabled: !!province,
  });
}

// Get all photos (for timeline and stats)
export function useAllPhotos() {
  return useQuery({
    queryKey: ['photos', 'all'],
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
  });
}

// Upload a photo
export function useUploadPhoto() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      photo,
    }: {
      file: File;
      photo: NewPhoto;
    }) => {
      if (!user) throw new Error('未登录');

      // 1. Upload file to Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${photo.province}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // 3. Insert into database
      const { data, error } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          province: photo.province,
          image_url: urlData.publicUrl,
          title: photo.title,
          description: photo.description,
          date: photo.date,
          category: photo.category,
          tags: photo.tags,
          rating: photo.rating,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// Delete a photo
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: Photo) => {
      // Extract file path from URL
      const url = new URL(photo.image_url);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/photos\/(.+)/);
      const filePath = pathMatch ? pathMatch[1] : null;
      if (filePath) {
        await supabase.storage.from('photos').remove([filePath]);
      }
      const { error } = await supabase.from('photos').delete().eq('id', photo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}
