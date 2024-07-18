
import '../styles/Project.scss'; // Importing the SCSS file
import img1 from "../assets/features_in_galaxy.jpeg";
import img2 from "../assets/variability_in_quasars.jpg";

const Project = () => {
  return (
    <div className="project">
      <section className="our_projects py-5">
        <div className="container">
          <h1 className="text-center mb-5 fade-in-down">Our Projects</h1>
          <div className="mb-4 fade-in">
            <p><strong>Finding features in Galaxy images:</strong></p>
            <ul>
              <li>
                The current published studies from various astronomical datasets are not
                adequate when it comes to detailed features from galaxy images.
              </li>
              <li>
                For citizen science, we explore multiband images that give us hints of scope
                for further investigation.
              </li>
              <li>
                Such nuanced features help us understand the galaxies and clusters from a new perspective.
              </li>
              <li>
                Given the vastness of data, ease of the analysis: citizen science projects can be the way to go!
              </li>
            </ul>
            <div className="first_project_image my-4">
              <img src={img1} alt="First Project" className="img-fluid fade-in" />
            </div>
          </div>
          <div className="mb-4 fade-in">
            <p>There are currently three Galaxy datasets where your participation would be appreciated:</p>
            <ul>
              <li>
                We are focusing on understanding peculiarities of morphological features of:
                <ul>
                  <li>Subaru HSC survey</li>
                  <ul>
                    <li>Galaxies discovered by three-layered, multi-band (grizy plus 4 narrow-band filters) imaging
                      survey with the Hyper Suprime-Cam (HSC) on the 8.2m Subaru Telescope.</li>
                    <li>The Hyper Suprime-Cam Subaru Strategic Program (HSC-SSP) is led by the astronomical communities
                      of Japan and Taiwan, and Princeton University.</li>
                  </ul>
                </ul>
              </li>
            </ul>
          </div>
          <div className="mb-4 fade-in">
            <p><strong>UPCOMING PROJECT</strong></p>
            <p><strong>Understanding the variability in quasars:</strong></p>
            <ul>
              <li>
                Often scientists explore spectral features of the astronomical sources. These spectra are measurements of the
                flux (number/ energy of photons) collected over the emission time per unit wavelength.</li>
              <li>
                Our motto for citizen science is also to involve science enthusiasts from all walks of life to learn about
                such technical interpretations in astronomy and help us explore undiscovered aspects of such spectral data.</li>
              <li>
                Our focus objects here are quasars. They are ultra luminous active galactic nuclei, in which a supermassive
                black hole with mass ranging from millions to billions of times solar mass is found to be
                surrounded by a gaseous stellar material.</li>
              <div className="second_project_image my-4">
                <img src={img2} alt="Second Project" className="img-fluid fade-in" />
              </div>
              <li>
                For this project, we consider SDSS DR16 quasar catalog, where the motto is to check variability of quasar
                emission with respect to wavelength. We will be comparing quasar spectra at different time intervals to
                detect the changes in emission.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Project;
