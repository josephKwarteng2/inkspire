interface FeaturedImageInputProps {
  featuredImage: string;
  setFeaturedImage: (image: string) => void;
}

export const FeaturedImageInput: React.FC<FeaturedImageInputProps> = ({
  featuredImage,
  setFeaturedImage,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-1">Featured Image</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {featuredImage && (
        <img
          src={featuredImage}
          alt="Featured Preview"
          className="mt-2 max-h-40 rounded border"
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};
