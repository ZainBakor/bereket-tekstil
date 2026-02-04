import './AnimatedBackground.css';

const AnimatedBackground = () => {
    return (
        <div className="elegant-background">
            {/* Subtle gradient overlay */}
            <div className="bg-gradient-overlay"></div>
            {/* Decorative gold accent lines */}
            <div className="bg-accent-line bg-accent-line-1"></div>
            <div className="bg-accent-line bg-accent-line-2"></div>
        </div>
    );
};

export default AnimatedBackground;
