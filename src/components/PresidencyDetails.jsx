const PresidencyDetails = ({ presidency }) => {
  if (!presidency) return null;

  return (
    <div className="tab-content">
      <p><strong>Period:</strong> {presidency.startYear} - {presidency.endYear}</p>
      <p>Number of ministries: {presidency.ministryNumber}</p>
      <div className="ministry-list">
        {presidency.ministries.map((ministry, index) => (
          <div key={index} className="ministry-item">
            <p>{ministry.ministry}</p>
          </div>
        ))}
</div>
      <div>
        <p><strong>See how the government structure changed</strong></p>
        <div className="org-container">
          <iframe
            src={` https://orgchart.datafoundation.lk/`}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div>
        <p>Top News</p>
      </div>


    </div>
  );
};

export default PresidencyDetails;
