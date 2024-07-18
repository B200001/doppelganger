import React, { useState } from 'react';
import '../styles/Register.scss';

type FormData = {
  phone_no: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  education: string;
  city: string;
  state: string;
  pin: string;
  affiliated_org: string;
  inspection_interest: string;
  work_hours: string;
  extra_work: string[];
  registration_date: string;
  profile_slug: string;
  picture: string;
  username: string;
  full_name: string;
  password: string;
  email: string; // Add email field here
};

const InputField = ({ label, type, name, value, onChange, placeholder }: any) => (
  <div className="form-group fade-in-left">
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder || ''} />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, children }: any) => (
  <div className="form-group fade-in-right">
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange}>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {children}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    phone_no: "",
    date_of_birth: "",
    gender: "Male",
    occupation: "",
    education: "",
    city: "",
    state: "",
    pin: "",
    affiliated_org: "",
    inspection_interest: "",
    work_hours: "",
    extra_work: [],
    registration_date: new Date().toISOString().slice(0, 10),
    profile_slug: "",
    picture: "",
    username: "",
    full_name: "",
    password: "",
    email: "" // Initialize email field
  });
  const baseUrl = import.meta.env.VITE_API_URL;

  const [showOtherOccupation, setShowOtherOccupation] = useState(false);
  const [showOtherContribution, setShowOtherContribution] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setShowOtherOccupation(value === 'other');
    handleChange(e);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "other") {
      setShowOtherContribution(checked);
    }
    setFormData(prevState => {
      const updatedContributions = checked
        ? [...prevState.extra_work, name]
        : prevState.extra_work.filter(contribution => contribution !== name);
      return { ...prevState, extra_work: updatedContributions };
    });
  };

  // const validateForm = () => {
  //   const requiredFields = [
  //     'phone_no', 'date_of_birth', 'gender', 'occupation', 'education', 
  //     'affiliated_org', 'inspection_interest', 'work_hours', 'username', 'password', 'email'
  //   ];
  //   return requiredFields.every(field => formData[field as keyof FormData]);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!validateForm()) {
    //   alert('Please fill all required fields.');
    //   return;
    // }

    try {
      const response = await fetch(`${baseUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
      console.log(formData);
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form fade-in">
        <h4 className="fade-in-down">To register for PKC Citizen Science projects, kindly submit the following form</h4>
        <p className="fade-in">All the fields are mandatory</p>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <InputField label="Phone Number" type="tel" name="phone_no" value={formData.phone_no} onChange={handleChange} />
            <InputField label="Date of Birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" }
            ]} />
          </div>
          <div className="row">
            <SelectField label="Occupation" name="occupation" value={formData.occupation} onChange={handleOccupationChange} options={[
              { value: "", label: "---Select---" },
              { value: "student", label: "Student" },
              { value: "professional", label: "Professional" },
              { value: "homemaker", label: "Homemaker" },
              { value: "other", label: "Other" }
            ]} />
            {showOtherOccupation && (
              <InputField type="text" name="occupationOther" value={formData.occupation} onChange={handleChange} placeholder="Please specify" />
            )}
            <SelectField label="Education Level" name="education" value={formData.education} onChange={handleChange} options={[
              { value: "highSchool", label: "High School" },
              { value: "bachelor", label: "Bachelor's Degree" },
              { value: "master", label: "Master's Degree" },
              { value: "phd", label: "PhD" }
            ]} />
          </div>
          <div className="row">
            <InputField label="City" type="text" name="city" value={formData.city} onChange={handleChange} />
            <InputField label="State" type="text" name="state" value={formData.state} onChange={handleChange} />
            <InputField label="PIN Code" type="text" name="pin" value={formData.pin} onChange={handleChange} />
          </div>
          <div className="row">
            <SelectField label="Affiliated Organization" name="affiliated_org" value={formData.affiliated_org} onChange={handleChange} options={[
              { value: "", label: "---Select---" },
              { value: "None", label: "None" },
              { value: "KV", label: "Khagol Vishwa (KV)" },
              { value: "JVP", label: "Jyotirvidya Parisanstha (JVP)" },
              { value: "NehruPlanetariumMumbai", label: "Nehru Planetarium, Mumbai" },
              { value: "Jawaharlal Nehru Planetarium (JNP), Bangalore", label: "Jawaharlal Nehru Planetarium (JNP), Bangalore" },
              { value: "Homi Bhabha Centre for Science Education, Mumbai", label: "Homi Bhabha Centre for Science Education, Mumbai" }
            ]} />
          </div>
          <div className="row">
            <SelectField label="Inspection Interest" name="inspection_interest" value={formData.inspection_interest} onChange={handleChange} options={[
              { value: "astronomicalImages", label: "Astronomical Images" },
              { value: "astronomicalSpectra", label: "Astronomical Spectra" },
              { value: "both", label: "Both" }
            ]} />
            <InputField label="Work Hours" type="text" name="work_hours" value={formData.work_hours} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Apart from visual inspection tasks, can you also contribute to the project in terms of:</label>
            <div className="form-group fade-in-left">
              <label>
                <input type="checkbox" name="Helping with data collection" checked={formData.extra_work.includes("Helping with data collection")} onChange={handleCheckboxChange} />
                Helping with data collection
              </label>
              <label>
                <input type="checkbox" name="Designing web interface" checked={formData.extra_work.includes("Designing web interface")} onChange={handleCheckboxChange} />
                Designing web interface
              </label>
              <label>
                <input type="checkbox" name="Basic computing (Python, Excel)" checked={formData.extra_work.includes("Basic computing (Python, Excel)")} onChange={handleCheckboxChange} />
                Basic computing (Python, Excel)
              </label>
              <label>
                <input type="checkbox" name="Basic programing (Python, R, other languages)" checked={formData.extra_work.includes("Basic programing (Python, R, other languages)")} onChange={handleCheckboxChange} />
                Basic programing (Python, R, other languages)
              </label>
              <label>
                <input type="checkbox" name="None" checked={formData.extra_work.includes("None")} onChange={handleCheckboxChange} />
                None
              </label>
              <label>
                <input type="checkbox" name="other" checked={formData.extra_work.includes("other")} onChange={handleCheckboxChange} />
                Other:
              </label>
              {showOtherContribution && (
                <InputField type="text" name="contributionOther" value={formData.extra_work.includes("other") ? formData.extra_work[formData.extra_work.length - 1] : ""} onChange={handleChange} placeholder="Please specify" />
              )}
            </div>
          </div>
          <div className="row">
            <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
            <InputField label="Fullname" type="text" name="fullname" value={formData.full_name} onChange={handleChange} />
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} /> {/* Add email input field */}
          </div>
          <button type="submit" className="btn btn-primary fade-in-up" >Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
