import { Ratio } from "react-bootstrap";
import '../styles/Home.scss'; // Assuming you have a separate Sass file for styling

const Home = () => {
  return (
    <div className="home">
      <section className="hero-section text-center">
        <h1>Citizen Science with Pune Knowledge Cluster</h1>
        <p>Often scientific research faces hurdles like enormous data size, instrumental and computational limitations. Our aim is to involve enthusiastic volunteers from the public to help us with data analysis. It will also enable implementation of policy of the Department of Science and Technology (DST) on Scientific Social Responsibility (SSR), which aims to strengthen the link between science and society.</p>
      </section>

      <div className="first-div py-5 bg-light">
        <div className="container">
          <ul className="list-unstyled">
            <li>Citizen science is the practice of public participation and collaboration in scientific research.</li>
            <li>Through citizen science, people share and contribute to data monitoring and collection programs.</li>
            <ul className="list-unstyled ps-4">
              Categories of participants:
              <li>General Public</li>
              <li>Amateur astronomers/ advanced citizens enthusiasts</li>
              <li>Students/ semester project interns</li>
            </ul>
          </ul>
        </div>
      </div>

      <div className="center-video py-5">
        <div className="container text-center">
          <h2>Celebrating Citizen Science Month - April 2023!</h2>
          <h4>Testimonials by Citizen Scientists</h4>
          <div className="video-container mx-auto">
            <Ratio aspectRatio="16x9">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/Xr1RbztU7No?si=DP-39507Ubf0yHtG" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </Ratio>
          </div>
        </div>
      </div>

      <div className="third-div py-5 bg-light">
        <div className="container text-center">
          <p>We are immensely thankful to all our Smart Citizen Scientists who have joined us from various parts of the world for their impactful contributions and persistent collaboration! To share our gratitude, we will be featuring you regularly on our Social Media, news and YouTube channel. Here is the first feature capturing testimonials from some of you! Many more to come in the future! We encourage you to keep on contributing to the program and help us showcase all of your efforts via such media posts and news items, hence widening our horizon more and more!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
