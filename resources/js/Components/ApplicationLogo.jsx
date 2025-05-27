// import raabtaaLogo from '/storage/raabtaalogo.png';
import raabtaaLogo from '/storage/raabtaalogo_w.png';

export default function ApplicationLogo({ className }) {
    return (
        <img
            src={raabtaaLogo}
            alt="Raabta"
            className={className}
        />
    );
}
