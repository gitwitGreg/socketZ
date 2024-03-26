export default function getTimeAgo(timestamp: string): string {
    const currentTime = new Date();
    const time = new Date(timestamp);
    const timeDifference = (currentTime.getTime() - time.getTime()) / 1000; // difference in seconds

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (timeDifference < secondsInMinute) {
        return 'Just now';
    } else if (timeDifference < secondsInHour) {
        const minutes = Math.floor(timeDifference / secondsInMinute);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < secondsInDay) {
        const hours = Math.floor(timeDifference / secondsInHour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(timeDifference / secondsInDay);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

