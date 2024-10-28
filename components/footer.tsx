const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto py-10 px-5 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between text-center lg:text-left space-y-6 lg:space-y-0 lg:space-x-10">
          {/* Brand Section */}
          <div className="lg:w-1/3">
            <h4 className="text-lg font-semibold text-gray-800">
              World Foods Andover Stores
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              &copy; 2024 Store, Inc. All rights reserved.
            </p>
          </div>

          {/* Contact Information */}
          <div className="lg:w-1/3">
            <h4 className="text-lg font-semibold text-gray-800">Contact Us</h4>
            <p className="text-sm text-gray-600 mt-2">
              Address: World Foods Andover Stores, SP10 3DW
            </p>
            <p className="text-sm text-gray-600">Mobile: 07881 968905</p>
            <p className="text-sm text-gray-600">Phone: 01264749485</p>
          </div>

          {/* Additional Links or Social Media */}
          {/* <div className="lg:w-1/3">
            <h4 className="text-lg font-semibold text-gray-800">Follow Us</h4>
            <div className="flex justify-center lg:justify-start space-x-4 mt-2">
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
