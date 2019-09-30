var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var mailgun_auth = {
    auth: {
        api_key: process.env.EMAIL_API_KEY,
        domain: process.env.EMAIL_DOMAIN
    }
}

function sendVerificationEmail(domain_host, name, email, verification_code, response){

    var nodemailerMailgun = nodemailer.createTransport(mg(mailgun_auth));
    const subject = "Verify Email Address";
    const body = "Hi "+name+",\nPlease click on following link to verify your email.\n\nhttp://"+domain_host+"/users/verify?email="+email+"&&code="+verification_code+"\n\nThanks.";

    nodemailerMailgun.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: subject,
        'h:Reply-To': process.env.SMTP_FROM,
        text: body
    }, function (err, info) {
        if (err) {
            response(null, error);
        } else {
            response("Verification Email Sent.", null);
        }
    });
}


module.exports = sendVerificationEmail



