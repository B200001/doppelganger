import React from 'react';
import '../styles/About.scss'; 
import img1 from "../assets/team/ajit_kembhavi.jpeg";
import img2 from "../assets/team/Sudhanshu.jpg";
import img3 from "../assets/team/vivekM.jpg";
import img4 from "../assets/team/imgonline-com-ua-resize-yWczyGexmMCP3my3.jpg";
import img5 from "../assets/team/File_004.jpeg";
import img6 from "../assets/pkc_csa_banner.jpg";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface TeamMemberCardProps {
  title: string;
  text: string;
  imgurl: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ title, text, imgurl }) => (
  <Card style={{ width: '18rem' }} className="m-3 animate__animated animate__fadeInUp">
    <Card.Img variant='top' src={imgurl} />
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
      <Button variant='primary'>More Info</Button>
    </Card.Body>
  </Card>
);

const About: React.FC = () => {
  return (
    <>
      <section className="about py-5">
        <div className="PKC_div container">
          <section>
            <img src={img6} alt="PKC" className="img-fluid animate__animated animate__fadeIn" />
          </section>
          <section className="text-center mb-5">
            <h1 className="animate__animated animate__fadeInDown">Pune Knowledge Cluster</h1>
          </section>
          <ul className="list-unstyled">
            <li className="mb-3 animate__animated animate__fadeIn">The Pune Knowledge Cluster (PKC) has been established by the Office of the Principal Scientific Advisor to the Government of India.</li>
            <li className="mb-3 animate__animated animate__fadeIn" style={{ animationDelay: '0.5s' }}>The aim is to bring together academia, R&D institutions, and the industry of Pune and its surrounding areas...</li>
            <li className="mb-3 animate__animated animate__fadeIn" style={{ animationDelay: '1s' }}>PKC aims to foster capacity building and promote skills development and entrepreneurship...</li>
            <li className="mb-3 animate__animated animate__fadeIn" style={{ animationDelay: '1.5s' }}>All relevant organisations and experts are partners and consulted to identify sustainable solutions...</li>
          </ul>
        </div>

        <section className="our_team py-5 bg-light">
          <div className="container text-center">
            <h1 className="animate__animated animate__fadeInUp">Our Team</h1>
            <div className='our_team_members'>
              <TeamMemberCard
                title="Prof. Ajit Kembhavi"
                text="He is an astrophysicist, working on stars, galaxies, quasars, and high-energy astrophysics. He is involved in data analytics, application of AI to astronomy and biology, and Virtual Observatories. He is an Emeritus Professor at IUCAA, of which he is a Founder Member and former Director. He is the Principal Investigator of PKC."
                imgurl={img1}
              />
              <TeamMemberCard
                title="Prof. Sudhanshu Barway"
                text="He is an astrophysicist, from the Indian Institute of Astrophysics, Bangalore, India. His focus is on extragalactic astronomy. He mostly works in the morphological transformation of galaxies and studies Lenticular (S0) galaxies in depth. He also likes to explore the physics behind Super Massive Black Holes, Super Star Clusters, and their co-evolution with galaxies."
                imgurl={img2}
              />
              <TeamMemberCard
                title="Prof. Vivek M."
                text="He is an astrophysicist working at Indian Institute of Astrophysics, Bangalore, India. Currently, his focus is on studying the variability in quasar outflows using SDSS-IV data. His broad research interests are in active galactic nuclei, supermassive black holes and machine learning techniques in astronomy."
                imgurl={img3}
              />
              <TeamMemberCard
                title="Dr. Disha Sawant"
                text="She is an Assistant Programme Manager with PKC working mainly on the Citizen Science programme and in the Environment vertical. Disha works on transient extragalactic objects like Gamma Ray Bursts and Supernovae. Her interests lie mainly in astronomy education, data analysis, and sustainability."
                imgurl={img4}
              />
              <TeamMemberCard
                title="Mr. Atharva Pathak"
                text="He currently works as a Software Engineer & Data Manager for the Pune Knowledge Cluster. He is also an Astronomer at IUCAA and has been working on website development, applications and localization of various software. He is also an integral part and member of India's oldest amateur astronomy club Jyotirvidya Parisanstha."
                imgurl={img5}
              />
            </div>
          </div>
        </section>

        <section className='our_partners py-5'>
          <div className="container">
            <h1 className="text-center mb-5 animate__animated animate__fadeInUp">Our Partners</h1>
            <div className='our_partners_info'>
              <p className="animate__animated animate__fadeIn">In our journey to encourage citizens to participate in sophisticated scientific research, we are joined by esteemed science enthusiasts. These are amateur astronomy clubs, science popularizing groups working in and around the city. We plan to initiate our citizen science projects with the help of their inputs and remarks. The idea is to test these science surveys on members of the groups and then based on their feedback, we open it to wider participants nationally and internationally.</p>
              <ul className="list-unstyled">
                <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.5s' }}><strong>Khagol Vishwa(KV):</strong></li>
                <p>It was established 1999 is a Pune based registered voluntary organisation working in the field of Amateur Astronomy. KV's main objective is to popularise Astronomy in general public, students in Maharashtra and to encourage them for serious astronomical studies and observations.</p>
                <li className="animate__animated animate__fadeIn" style={{ animationDelay: '1s' }}><strong>Jyotirvidya Parisanstha (JVP):</strong></li>
                <p>An association of amateur astronomers and a non-profit organization. On August 22, 1944 some eminent citizens of Pune formed JVP, primarily to spread the knowledge of astronomy among the public and also to make their own contribution as far as possible.</p>
                <li className="animate__animated animate__fadeIn" style={{ animationDelay: '1.5s' }}><strong>Nehru Planetarium, Mumbai:</strong></li>
                <p>The Nehru Planetarium, commissioned on 3rd March 1977, with the objective of fostering scientific temper through the means of edutainment. The planetarium has been making learning Astronomy a pleasant experience. It also has grown into a Center for the scientific study of astronomy and for a meeting of scientists and scholars for discussions and lectures, arranged periodically on various stellar and Astronomical events.</p>
                <li className="animate__animated animate__fadeIn" style={{ animationDelay: '2s' }}><strong>Jawaharlal Nehru Planetarium (JNP), Bangalore:</strong></li>
                <p>It is administered by the Bangalore Association for Science Education (BASE). JNP started in 1989, has emerged as a premier institution in India. It attracts over 3 lakh visitors annually, majority of whom are students. It is equipped with a large 15.0m dome and a state of the art hybrid projection system installed and commissioned in 2017. JNP has monthly star gazing, monthly science movies, Sky-theatre show every day, viewing of astronomical events etc.</p>
                <li className="animate__animated animate__fadeIn" style={{ animationDelay: '2.5s' }}><strong>Homi Bhabha Centre for Science Education, Mumbai:</strong></li>
                <p>The broad goals of the Centre are to promote equity and excellence in science and mathematics education from primary school to undergraduate college level, and encourage the growth of scientific literacy in the country.</p>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

export default About;
