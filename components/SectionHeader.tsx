import StarIcon from '@/public/svg/StarIcon';

interface ISectionHeader {
  title: string;
  titleTwo?: string;
  icon?: React.ReactNode;
}
const SectionHeader = (p: ISectionHeader) => {
  return (
    <div className='space-y-6 relative'>
      <div className='flex items-start'>
        <div className='absolute -top-6 -left-4'>
          {p.icon ? p.icon : <StarIcon />}
        </div>
        <h2 className='text-3xl md:text-4xl font-extrabold leading-tight z-10 text-secondary dark:text-white'>
          {p.title}
          <br />
          {p.titleTwo}
        </h2>
      </div>
    </div>
  );
};

export default SectionHeader;
