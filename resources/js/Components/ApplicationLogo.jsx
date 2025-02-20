import raabtaaLogo from '/storage/raabtaalogo.png';

export default function ApplicationLogo({ className }) {
    return (
        <img
            src={raabtaaLogo}
            alt="Raabta"
            className={className}
        />
    );
}
