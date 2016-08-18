'use strict';

const Component = require('../core/Component.js');

class CanvasBars extends Component {
    constructor(options, canvas) {
        super(Object.assign({}, CanvasBars.defaults, options));

        this.canvas = canvas || document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height + this.options.shadowHeight;

        this.context = this.canvas.getContext('2d');
    }

    render(data) {
        let i, x, y, val, step, index, last, barSize, fullWidth,
            length = data.length,
            canvas = this.canvas,
            context = this.context,
            { height, width, barWidth, barSpacing, color, shadowHeight, shadowColor } = this.options;

        // Reset canvas
        if (canvas.width !== width || canvas.height !== height + shadowHeight) {
            canvas.width = width;
            canvas.height = height + shadowHeight;
        }
        else {
            context.clearRect(0, 0, width, height + shadowHeight);
        }

        // Calculate bar widths
        if (barWidth < 0 && barSpacing < 0) {
            barWidth = barSpacing = (width / length) / 2;
        }
        else if (barSpacing >= 0 && barWidth < 0) {
            barWidth = (width - (length * barSpacing)) / length;
            if (barWidth <= 0) barWidth = 1;
        }
        else if (barWidth > 0 && barSpacing < 0) {
            barSpacing = (width - (length * barWidth)) / length;
            if (barSpacing <= 0) barSpacing = 1;
        }

        // Calculate bars to display
        barSize = barWidth + barSpacing;
        fullWidth = barSize * length;

        // Stepping
        step = (fullWidth > width) ? fullWidth / width : 1;

        // Canvas setup
        this.setColor(color, 0, 0, 0, height);

        // Draw bars
        for (i = 0, x = 0, y = height, last = null; i < length && x < fullWidth; i += step, x += barSize) {
            index = ~~i;

            if (index !== last) {
                val = data[index] * height;
                last = index;

                context.fillRect(x, y, barWidth, -val);
            }
        }

        // Draw shadow bars
        if (shadowHeight > 0) {
            this.setColor(shadowColor, 0, height, 0, height + shadowHeight);

            for (i = 0, x = 0, y = height, last = null; i < length && x < fullWidth; i += step, x += barSize) {
                index = ~~i;

                if (index !== last) {
                    val = data[index] * shadowHeight;
                    last = index;

                    context.fillRect(x, y, barWidth, val);
                }
            }
        }
    }

    setColor(color, x1, y1, x2, y2) {
        let i, gradient, len,
            context = this.context;

        if (color instanceof Array) {
            len = color.length;
            gradient = this.context.createLinearGradient(x1, y1, x2, y2);
            for (i = 0; i < len; i++) {
                gradient.addColorStop(i / (len - 1), color[i]);
            }
            context.fillStyle = gradient;
        }
        else {
            context.fillStyle = color;
        }
    }

    getColor(start, end, pct) {
        let startColor = {
            r: parseInt(start.substring(1,3), 16),
            g: parseInt(start.substring(3,5), 16),
            b: parseInt(start.substring(5,7), 16)
        };

        let endColor = {
            r: parseInt(end.substring(1,3), 16),
            g: parseInt(end.substring(3,5), 16),
            b: parseInt(end.substring(5,7), 16)
        };

        let c = {
            r: ~~((endColor.r - startColor.r) * pct) + startColor.r,
            g: ~~((endColor.g - startColor.g) * pct) + startColor.g,
            b: ~~((endColor.b - startColor.b) * pct) + startColor.b
        };

        return '#' + c.r.toString(16) + c.g.toString(16) + c.b.toString(16);
    }
}

CanvasBars.defaults = {
    width: 300,
    height: 100,
    barWidth: -1,
    barSpacing: -1,
    shadowHeight: 100,
    color: '#FFFFFF',
    shadowColor: '#CCCCCC'
};

module.exports = CanvasBars;