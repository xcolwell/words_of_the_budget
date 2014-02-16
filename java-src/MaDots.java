import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JPanel;



public class MaDots {

	public static void main(final String[] in) {
		try {
			final BufferedImage buffer = ImageIO.read(new File("/home/xcolwell/Desktop/lodes3.png"));
			final Raster r = buffer.getRaster();
			
			final int w = buffer.getWidth();
			final int h = buffer.getHeight();
			
			final float[] px = new float[4];
			
			int total = w  * h;
			int prog = 0;
			
			List<int[]> processed = new ArrayList<int[]>(32);
			for (int j = 0; j < h; ++j) {
				for (int i = 0; i < w; ++i) {
					if (0 == (prog % 10000)) {
						System.out.printf("On %d of %d (%d%%)\n", prog, total, (100 * prog) / total);
					}
					if (isBlack(r.getPixel(i, j, px)) && !contains(processed, i, j)) {
						// trace both sides
						int i2 = i + 1;
						for (; i2 < w && isBlack(r.getPixel(i2, j, px)); ++i2) { }
						int j2 = j + 1;
						for (; j2 < h && isBlack(r.getPixel(i, j2, px)); ++j2) { }
						processed.add(new int[]{i, j, i2, j2});
					}
					
					++prog;
				}
			}
			
			List<int[]> midPoints = new ArrayList<int[]>(processed.size());
			int maxMidi = 0;
			int minMidi = w;
			int maxMidj = 0;
			int minMidj = h;
			for(int[] bounds : processed) {
				int midi = (bounds[0] + bounds[2]) / 2;
				int midj = (bounds[1] + bounds[3]) / 2;
				if (maxMidi < midi) { maxMidi = midi; }
				if (midi < minMidi) { minMidi = midi; }
				if (maxMidj < midj) { maxMidj = midj; }
				if (midj < minMidj) { minMidj = midj; }
//				System.out.printf("[%f, %f],\n", midi / (float) w, midj / (float) h);
				midPoints.add(new int[]{midi, midj});
			}
			for(int[] bounds : processed) {
				int midi = (bounds[0] + bounds[2]) / 2;
				int midj = (bounds[1] + bounds[3]) / 2;
				System.out.printf("[%f, %f],\n", (midi - minMidi) / (float) (maxMidi - minMidi), 
						(midj - minMidj) / (float) (maxMidj - minMidj));
			}
			
			show(midPoints);
			
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static boolean isBlack(final float[] px) {
		final float T = 0.1f;
		return px[0] <= T && px[1] <= T && px[2] <= T;
	}
	private static boolean contains(final Collection<int[]> allBounds, final int i, final int j) {
		for (int[] bounds : allBounds) { if (contains(bounds, i, j)) { return true; } }
		return false;
	}
	private static boolean contains(final int[] bounds, final int i, final int j) {
		return bounds[0] <= i && i < bounds[2]
		&& bounds[1] <= j && j < bounds[3];
	}
	
	private static void show(final List<int[]> points) {
		final JComponent can = new JPanel() {
			@Override
			protected void paintComponent(Graphics g) {
				super.paintComponent(g);
				final Graphics2D g2d = (Graphics2D) g;
				
				Ellipse2D.Float e = new Ellipse2D.Float();
				for (int[] point : points) {
					float r = 6;
//					g2d.drawRect(point[0] - 2, point[1] - 2, 4, 4);
					e.setFrame(point[0] - r, point[1] - r, 2 * r, 2 * r);
					g2d.fill(e);
				}
			}
		};
		
		final JFrame f = new JFrame();
		final Container c = f.getContentPane();
		c.setLayout(new BorderLayout());
		
		c.add(can, BorderLayout.CENTER);
		
		f.setSize(600, 600);
		
		f.setVisible(true);
	}
}
