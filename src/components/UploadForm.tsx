import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadPhoto } from '../hooks/usePhotos';
import Button from './ui/Button';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';

interface UploadFormProps {
  province: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UploadForm({ province, onSuccess, onCancel }: UploadFormProps) {
  const uploadPhoto = useUploadPhoto();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<'美食' | '景点' | '生活照' | '史迪奇' | '一二布布' | '其他'>('美食');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim() || !date || !category) return;

    uploadPhoto.mutate(
      {
        file,
        photo: {
          user_id: '',
          province,
          title: title.trim(),
          description: description.trim(),
          date,
          category,
          tags,
          rating,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-bold text-ink text-center">
        🌸 添加照片 · {province}
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-gold bg-gold/20 scale-[1.02]' : 'border-white/10 hover:border-gold/50 bg-transparent'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="预览" className="max-h-48 mx-auto rounded-lg" />
        ) : (
          <div className="space-y-2">
            <div className="text-3xl">📷</div>
            <p className="text-sm text-ink-light">
              {isDragActive ? '松手即可上传' : '拖拽照片到这里，或点击选择'}
            </p>
            <p className="text-[11px] text-ink-light/50">支持 JPG/PNG/WebP，最大 10MB</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">标题 *</label>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给这张照片起个名字..."
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">描述</label>
        <textarea
          className="input-field resize-none h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="写下此刻的心情..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-light font-medium">日期 *</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-light font-medium">分类 *</label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value as '美食' | '景点' | '生活照' | '史迪奇' | '一二布布' | '其他')}
          >
            <option value="美食">🍜 美食</option>
            <option value="景点">🏔️ 景点</option>
            <option value="生活照">📸 生活照</option>
            <option value="史迪奇">👾 史迪奇</option>
            <option value="一二布布">🧸 一二布布</option>
            <option value="其他">📷 其他</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">标签</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            }}
            placeholder="输入标签后按回车..."
          />
          <Button type="button" variant="ghost" onClick={addTag}>添加</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">评分</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          取消
        </Button>
        <Button
          type="submit"
          disabled={!file || !title.trim() || uploadPhoto.isPending}
          className="flex-1"
        >
          {uploadPhoto.isPending ? '上传中...' : '🌸 发布'}
        </Button>
      </div>
    </form>
  );
}
