import {ThemeToggle} from '@/components/theme-toggle';

interface ILandpageLayout {
  children: React.ReactNode;
}
const LandpageLayout = ({children}: ILandpageLayout) => {
  return (
    <>
      {children}
      <ThemeToggle />
    </>
  );
};

export default LandpageLayout;
