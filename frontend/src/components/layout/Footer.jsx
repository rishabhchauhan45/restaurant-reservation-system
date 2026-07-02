import { MdRestaurantMenu } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <MdRestaurantMenu className="w-4 h-4 text-dark-950" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              ReserveIt
            </span>
          </div>
          <p className="text-dark-500 text-xs">
            &copy; {new Date().getFullYear()} ReserveIt. Crafted for exceptional dining experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
