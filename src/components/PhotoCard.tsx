import type { Photo } from '../types';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';
import { useAuth } from '../hooks/useAuth';
import { useDeletePhoto } from '../hooks/usePhotos';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
}

const categoryIcons: Record<string, string> = {
  '美食': '🍜',
  '景点': '🏔️',
  '生活照': '📸',
  '史迪奇': '👾',
  '一二布布': '🧸',
  '其他': '📷',
};

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const { user } = useAuth();
  const deletePhoto = useDeletePhoto();
  const isOwner = user?.id === photo.user_id;

  return (
    <div
      onClick={() => onClick(photo)}
      className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer
                 hover:shadow-md hover:border-gold/30 transition-all group"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      {/* Info area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{categoryIcons[photo.category] || '📷'}</span>
            <h4 className="font-medium text-sm text-ink truncate">{photo.title}</h4>
          </div>
          <p className="text-[11px] text-ink-light mt-0.5 truncate">{photo.description || '暂无描述'}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-1">
          {photo.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {photo.tags.slice(0, 2).map((tag) => (
                <Tag key={tag} label={tag} color="bg-gold/20 text-gold" />
              ))}
              {photo.tags.length > 2 && (
                <span className="text-[10px] text-ink-light">+{photo.tags.length - 2}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <StarRating value={photo.rating} readonly />
            <span className="text-[10px] text-ink-light">
              {photo.date} · {photo.profile?.nickname || '未知'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete button (owner only) */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('确定删除这张照片吗？')) {
              deletePhoto.mutate(photo);
            }
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-start
                     text-ink-light hover:text-red-400 text-sm p-1"
          title="删除"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
