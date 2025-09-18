import { Shield, Zap, Heart, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safety First',
      description: 'Your security and well-being are our top priority in every feature we develop'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Smart Technology',
      description: 'Leveraging AI and real-time data to provide intelligent safety solutions'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Traveler-Centric',
      description: 'Every feature is designed with the traveler experience and safety in mind'
    }
  ];

  const stats = [
    { number: '2.5M+', label: 'Protected Travelers', icon: <Users className="w-6 h-6" /> },
    { number: '19+', label: 'Helplines', icon: <Globe className="w-6 h-6" /> },
    { number: '99.9%', label: 'Safety Score', icon: <Award className="w-6 h-6" /> },
    { number: '24/7', label: 'Monitoring', icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Us
              </h1>
              <h2 className="text-2xl text-orange-600 font-semibold mb-6">
                Your trusted companion for safe and smart travel in India
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sanchar is India's premier tourist safety platform, developed as part of the Smart India Hackathon initiative. 
                We combine cutting-edge technology with local expertise to ensure every traveler experiences India safely and confidently.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform provides comprehensive safety solutions including real-time monitoring, AI-powered risk assessment, 
                emergency response systems, and multilingual support to create a secure travel ecosystem for both domestic 
                and international tourists.
              </p>
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors">
                Learn More
              </button>
            </div>
            <div className="relative">
              <img
                src="images/Indiagate.jpg"
                alt="Tourist safety illustration"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that drive our mission to make India the safest travel destination
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6 mx-auto text-orange-600">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Real numbers that showcase our commitment to tourist safety
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto text-white">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-orange-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="images/Redfort.jpg"
                alt="India tourism"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To create a comprehensive digital ecosystem that ensures the safety and security of every tourist 
                visiting India, while enhancing their travel experience through innovative technology solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We envision an India where tourists can explore freely, knowing they have access to immediate help, 
                real-time safety information, and a network of support that spans across the entire country.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-800 mb-2">
                  Smart India Hackathon Initiative
                </h3>
                <p className="text-orange-700">
                  This platform was developed as part of the government's Smart India Hackathon, 
                  bringing together innovation and public safety to serve our nation's tourism industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for India, Built by India
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collaborative effort between technology innovators, government agencies, 
              and local safety experts to create a world-class tourist safety platform
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Government Partnership
                </h3>
                <p className="text-gray-600 mb-4">
                  Working closely with the Ministry of Tourism, local police departments, 
                  and emergency services to ensure seamless integration with existing safety infrastructure.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Ministry of Tourism collaboration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    State police integration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Emergency services network
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Local tourism boards
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Third party branches
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                  alt="Government collaboration"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;