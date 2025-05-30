const PresidencyDetails = ({ presidency }) => {
    if (!presidency) return null;
  
    return (
      <div>
        <p><strong>Period:</strong> {presidency.startYear} - {presidency.endYear}</p>
        
      </div>
    );
  };

  export default PresidencyDetails;