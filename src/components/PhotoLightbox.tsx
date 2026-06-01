import { useEffect, useState } from 'react';
import type { Photo } from '../types';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useUpdatePhoto, useDeletePhoto } from '../hooks/usePhotos';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
}

const CAT_ICONS: Record<string, string> = {
  '美食': '🍜', '景点': '🏔️', '生活照': '📸', '史迪奇': '👾', '一二布布': '🧸', '花': '🌺', '其他': '📷',
};

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const { user } = useAuth();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const isOwner = user?.id === photo.user_id;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [date, setDate] = useState(photo.date);
  const [category, setCategory] = useState(photo.category);
  const [tags, setTags] = useState<string[]>(photo.tags);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState(photo.rating);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') editing ? setEditing(false) : onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, editing]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(''); }
  }

  function removeTag(tag: string) { setTags(tags.filter((t) => t !== tag)); }

  async function handleSave() {
    updatePhoto.mutate(
      { id: photo.id, updates: { title: title.trim(), description: description.trim(), date, category, tags, rating } },
      { onSuccess: () => setEditing(false) }
    );
  }

  function handleDelete() {
    if (confirm('确定删除这张照片吗？')) {
      deletePhoto.mutate(photo, { onSuccess: onClose });
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/5 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10"
        >
          ✕
        </button>

        {/* Image */}
        <div className="aspect-[4/3] bg-white/5 rounded-t-2xl overflow-hidden">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-5 space-y-3">
          {editing ? (
            <>
              <input className="input-field text-base font-bold" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" />
              <textarea className="input-field resize-none h-16" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="描述" />

              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
                <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  {Object.entries(CAT_ICONS).map(([k, v]) => (
                    <option key={k} value={k}>{v} {k}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input className="input-field flex-1" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                       onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                       placeholder="添加标签..." />
                <Button type="button" variant="ghost" onClick={addTag}>添加</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {tags.map((t) => (<Tag key={t} label={t} onRemove={() => removeTag(t)} />))}
                </div>
              )}

              <StarRating value={rating} onChange={setRating} />

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setEditing(false)} className="flex-1">取消</Button>
                <Button onClick={handleSave} disabled={!title.trim() || updatePhoto.isPending} className="flex-1">
                  {updatePhoto.isPending ? '保存中...' : '💾 保存'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-ink">{photo.title}</h2>
              {photo.description && <p className="text-sm text-ink-light leading-relaxed">{photo.description}</p>}

              <div className="flex items-center gap-4 flex-wrap">
                <StarRating value={photo.rating} readonly />
                <span className="text-sm text-ink-light">{photo.profile?.nickname || '未知'} · {photo.date}</span>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-gold text-black px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {CAT_ICONS[photo.category]} {photo.category}
                </span>
                {photo.tags.map((tag) => (<Tag key={tag} label={tag} />))}
              </div>

              {isOwner && (
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setEditing(true)} className="text-xs">✏️ 编辑</Button>
                  <Button variant="ghost" onClick={handleDelete} className="text-xs text-red-400">🗑️ 删除</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
