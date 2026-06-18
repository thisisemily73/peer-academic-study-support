import Layout from "../../components/Layout/Layout";
import "./Feedback.css";

export default function Feedback() {
    return (
        <Layout>
            <div className="feedback-container">
                <div className="feedback-header">
                    <h1>PASS Feedback 💙</h1>
                    <p>
                        Have an idea, found a bug, or want to request notes?
                        We'd love to hear from you!
                    </p>
                </div>

                <div className="form-wrapper">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLScVVN0ehl3JpjtSfCyd6Z6MjjIO8mesig1U9hqXjRNuV4HUcA/viewform?embedded=true"
                        width="100%"
                        height="1200"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        title="PASS Feedback Form"
                    >
                        Loading...
                    </iframe>
                </div>
            </div>
        </Layout>
    );
}