import Logo from '../../assets/Logo.svg';

export const Header = () => {
  return (
    <header className="fixed top-0 flex justify-between items-center w-full h-24 px-24 py-4">
      <div className="flex flex-row items-center gap-4">
        <img src={Logo} alt="Logo" />
        <div className="text-2xl font-bold">스마트 소상공인 대시보드</div>
      </div>
      <div className="flex flex-row items-center">
        <div>SEED+ 인증</div>
        <div>김사장</div>
      </div>
    </header>
  );
};

export default Header;
