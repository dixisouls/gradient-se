import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Keyur Savalia",
      description:
        "Hi! I am a graduate student from India. And I'm going to be a SE at Amazon. Wohooo!",
      image: "/team/img_keyur.jpeg",
    },
    {
      name: "Divya Panchal",
      description:
        "I'm Divya and I'm a DS & AI student from India. I love Coca-Cola!",
      image: "/team/img_divya.jpeg",
    },
    {
      name: "Dhvanil Bhagat",
      description:
        "I'm Dhvanil, a DS & AI student at SF State. I love to work-out.",
      image: "/team/img_dhvanil.jpeg",
    },
    {
      name: "Yash Patel",
      description:
        "Hello!, I'm Yash Patel, a Computer Science Major at SF State. I love my country.",
      image: "/team/img_yash.jpeg",
    },
    {
      name: "Jacob Lazzarini",
      description:
        "Hey! I am Jacob Lazzarini a Computer Science Student at San Francisco State. I love basketball and football.",
      image: "/team/img_jacob.jpeg",
    },
    {
      name: "Kevin Chuong",
      description:
        "Hey there! I'm Kevin Chuong, a Computer Science student at San Francisco State University. I love frozen yogurt and cheesecake!",
      image: "/team/img_kevin.jpeg",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">About Us</h1>

        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gradient-primary bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
              GRADiEnt - Your Friendly Grader!
            </h2>
            <p className="mt-2 text-gray-600">
              GRADiEnt is an AI-powered grading assistant designed to help
              educators and students with instant feedback and assessment. Our
              platform uses advanced AI to provide detailed analysis on
              assignments, helping students learn faster and instructors teach
              more effectively.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => {
              // Array of subtle background colors for differentiation
              const bgColors = [
                "bg-blue-50",
                "bg-purple-50",
                "bg-pink-50",
                "bg-green-50",
                "bg-yellow-50",
                "bg-indigo-50",
              ];

              // Get a background color based on index
              const bgColor = bgColors[index % bgColors.length];

              return (
                <div
                  key={index}
                  className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gradient-primary`}
                >
                  <div className="rounded-full w-32 h-32 mb-4 p-1 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/team/placeholder.png";
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">
                    {member.name}
                  </h4>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutUsPage;
