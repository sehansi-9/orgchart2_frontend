const PresidencyDetails = ({ presidency }) => {
    if (!presidency) return null;
  
    return (
      <div>
        <p><strong>Period:</strong> {presidency.startYear} - {presidency.endYear}</p>

        <p>Number of ministries : {presidency.ministryNumber}  </p>
      </div>
    );
  };

  export default PresidencyDetails;