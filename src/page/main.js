const ctx = document.getElementById('pieChart').getContext('2d');

const data = {
  labels: ['halo-mumun', 'face-recog', 'cotrax-extension'],
  datasets: [{
    label: 'code-playtime',
    data: [95, 45, 80],
    backgroundColor: [
      '#00FF00',
      '#00AA00',
      '#007700'
    ],
    hoverOffset: 20
  }]
};

const config = {
  type: 'pie',
  data: data,
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const hours = Math.floor(value / 60);
            const minutes = value % 60;

            const hourStr = hours > 0 ? `${hours}h` : '';
            const minStr = minutes > 0 ? `${minutes}m` : '';
            const timeStr = [hourStr, minStr].filter(Boolean).join(' ');

            return `${label}: ${timeStr}`;
          }
        }
      }
    }
  }
};

new Chart(ctx, config);
