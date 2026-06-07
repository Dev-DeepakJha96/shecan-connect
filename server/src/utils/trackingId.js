const Volunteer = require("../models/Volunteer"); 

const generateTrackingId = async () => { 

    const count = await Volunteer.countDocuments(); 

    return `VOL-${Date.now()}-${count + 1}`;
}  

module.exports = generateTrackingId ; 