const Volunteer = require("../models/Volunteer");

const trackingApplication = async (req,res) => { 
 try {
        const {trackingId} = req.params; 

    const volunteer = await Volunteer.findOne({ trackingId })
    .select('fullName email status appliedAt updatedAt statusHistory');

    if(!volunteer){
        return res.status(404).json({
            success: false, 
            message: "Invalid tracking Id. Please check and try again."
        })
    }
    res.status(200).json({
        success: true, 
        data: {
            email: volunteer.email , 
            name: volunteer.fullName,
            status: volunteer.status,
            appliedDate: volunteer.appliedAt,
            lastUpdated: volunteer.updatedAt , 
            statusHistory: volunteer.statusHistory
        }
    })
 } catch (error) {
    res.status(500).json({
        success: false , 
        message: 'Error tracking applicaion', 
    })
 }
}

module.exports = trackingApplication; 