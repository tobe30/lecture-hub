export default function VideoPreview() {
  return (
    <section className="bg-[#f7f7f8] pb-20">
      <div className="mx-auto max-w-[1200px] px-4">
        
        <div className="overflow-hidden rounded-[16px] shadow-xl">
          <img
            src="/video.jpg"
            alt="video meeting"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
}