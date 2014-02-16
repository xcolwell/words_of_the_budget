import java.awt.Font;
import java.awt.Shape;
import java.awt.font.FontRenderContext;
import java.awt.geom.Area;
import java.awt.geom.GeneralPath;
import java.awt.geom.PathIterator;
import java.awt.geom.Rectangle2D;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

// TODO: second approach
// because order isn't reliable, e..g in old, o comes last?
// use a forest of areas, where child link is "contained"

public class Fontler {
	

	// TTF0 uses zero winding rule, so the shapes have no "holes"
	
	public static void main(String[] in) {
		try {
			final InputStream is = Fontler.class.getResourceAsStream("Garamond.ttf");
			final Font f = Font.createFont(Font.TRUETYPE_FONT, is).deriveFont(128.f);
			is.close();
			final FontRenderContext frc = new FontRenderContext(null, false, true);

//			int n = 20;
//			final String[] ws = Arrays.asList(words.split("\\s+")).subList(0, n).toArray(new String[n]);
			
			final String[] ws = readWords();
			
			int geometryBlockSize = 1;
			
			final float pinchf = 0.01f;
			
			{
				StringBuilder sb = new StringBuilder();
				sb.append("var geometryBlockSize=").append(geometryBlockSize).append(";\n");
				sb.append("var outlines=new Array(").append(ws.length).append(");\n");
				sb.append("var envelopes=new Array(").append(ws.length).append(");\n");
				sb.append("var envelope_pinchf=").append(pinchf).append(";\n");
				Writer w = new FileWriter(new File("word_geometry.js"));
				w.write(sb.toString());
				w.close();
			}
			
			{
				for (int i = 0, blocki = 0; i < ws.length; i += geometryBlockSize, ++blocki) {
					Writer w = new FileWriter(new File("geometry/word_outlines_" + blocki + ".js"));
					w.write(outlineJson3(ws, i, Math.min(ws.length - i, geometryBlockSize), f, frc));
					w.close();
				}
			}
			{
				for (int i = 0, blocki = 0; i < ws.length; i += geometryBlockSize, ++blocki) {
					Writer w = new FileWriter(new File("geometry/word_envelopes_" + blocki + ".js"));
					w.write(outlineJson2(ws, i, Math.min(ws.length - i, geometryBlockSize), f, frc, pinchf));
					w.close();
				}
			}
			
			
			
			
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static String[] readWords() throws IOException {
		List<String> ws = new ArrayList<String>(2048);
		final BufferedReader r = new BufferedReader(new InputStreamReader(Fontler.class.getResourceAsStream("words.txt"), "UTF-8"));
		try {
			for (String line; null != (line = r.readLine()); ) {
				ws.add(line.trim());
			}
		}
		finally {
			r.close();
		}
		return ws.toArray(new String[ws.size()]);
	}
	
	/**
	 * Double pass method (buggy implementation).
	 */
	private static String outlineJson1(final String[] ws, final Font f, final FontRenderContext frc) {
		StringBuilder sb = new StringBuilder(16 * 1024);
		sb.append("outlines=new Array(").append(ws.length).append(");\n");
		for (int i = 0; i < ws.length; ++i) {
			System.out.printf("Outlining %s ...\n", ws[i]);
			sb.append("/* ").append(ws[i]);
			sb.append("*/ outlines[").append(i).append("]=");
			outlineJson1(sb, ws[i].toUpperCase(), f, frc);
			sb.append(";\n");
		}
		return sb.toString();
	}
	
	private static String outlineJson1(StringBuilder sb, String word, Font f, FontRenderContext frc) {
		Shape outline = f.createGlyphVector(frc, word).getOutline();
		// Area will convert to non-zero winding rule,
		// which is what HTML5 canvas can support
		double flatness = 0.1;
		
		float[] coords = new float[6];
		float minx = 0, maxx = 0, miny = 0, maxy = 0;
		{
			// each connected part, build an area
			// for subsequent parts, test if previous part
			// contained them.
			// if so, subtract them from previous; otherwise, create new
			int pointi = 0;
			for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
				assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
				final int type = pitr.currentSegment(coords);
				switch (type) {
					case PathIterator.SEG_CLOSE:
						break;
					case PathIterator.SEG_MOVETO:
						// Fall through to LINETO
					case PathIterator.SEG_LINETO:
						if (0 == pointi) {
							minx = coords[0];
							maxx = coords[0];
							miny = coords[1];
							maxy = coords[1];
						}
						else {
							if (coords[0] < minx) { minx = coords[0]; }
							else if (maxx < coords[0]) { maxx = coords[0]; }
							if (coords[1] < miny) { miny = coords[1]; }
							else if (maxy < coords[1]) { maxy = coords[1]; }
						}
						++pointi;
						break;
					case PathIterator.SEG_QUADTO:
					case PathIterator.SEG_CUBICTO:
					default:
						throw new IllegalStateException(String.format("Unknown segement type: %d", type));
				}
			}
		}
		
		
		int segi = 0;
		
//		StringBuilder sb = new StringBuilder(1024);
		sb.append("[");
		sb.append(minx).append(",").append(maxx)
		.append(",").append(miny).append(",").append(maxy)
		.append(", [");
		
		GeneralPath accum = new GeneralPath();
		Area parea = new Area();
		List<Area> holes = new ArrayList<Area>(4);
		
		for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
			assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
			final int type = pitr.currentSegment(coords);
			switch (type) {
				case PathIterator.SEG_CLOSE:
					accum.closePath();
					Area accumArea = new Area(accum);
					if (! accumArea.isEmpty()) {
						if (!parea.isEmpty() && parea.getBounds2D().contains(accumArea.getBounds2D())) {
	//						System.out.printf("Subtracting ...\n");
	//						parea.subtract(accumArea);
	//						if (! accumArea.isEmpty()) {
	//							pts(true, sb, coords, flatness, accumArea, segi, minx, maxx, miny, maxy);
	//							++segi;
	//						}
							holes.add(accumArea);
						}
						else {
							if (! parea.isEmpty()) {
								pts(false, sb, coords, flatness, parea, segi, minx, maxx, miny, maxy);
								++segi;
								for (Area hole : holes) {
									pts(true, sb, coords, flatness, hole, segi, minx, maxx, miny, maxy);
									++segi;
								}
								holes.clear();
							}
							assert holes.isEmpty();
							parea = accumArea;
						}
					}
					break;
				case PathIterator.SEG_MOVETO:
					accum.reset();
					accum.moveTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_LINETO:
					accum.lineTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_QUADTO:
				case PathIterator.SEG_CUBICTO:
				default:
					throw new IllegalStateException(String.format("Unknown segement type: %d", type));
			}
		}
		if (! parea.isEmpty()) {
			pts(false, sb, coords, flatness, parea, segi, minx, maxx, miny, maxy);
			++segi;
			for (Area hole : holes) {
				pts(true, sb, coords, flatness, hole, segi, minx, maxx, miny, maxy);
				++segi;
			}
			holes.clear();
		}
		assert holes.isEmpty();
		
		sb.append("]]");
		return sb.toString();
	}
	
	
	
	
	/**
	 * Envelope method.
	 */
	private static String outlineJson2(final String[] ws, final int i0, final int n, final Font f, final FontRenderContext frc, float pinchf) {
		StringBuilder sb = new StringBuilder(16 * 1024);
//		final float pinchf = 0.01f;
//		sb.append("envelopes=new Array(").append(ws.length).append(");\n");
//		sb.append("envelope_pinchf=").append(pinchf).append(";\n");
		for (int i = 0; i < n; ++i) {
			System.out.printf("Enveloping %s ...\n", ws[i0 + i]);
			sb.append("/* ").append(ws[i0 + i]);
			sb.append("*/ envelopes[").append(i0 + i).append("]=");
			outlineJson2(sb, ws[i0 + i].toUpperCase(), f, frc, pinchf);
			sb.append(";\n");
		}
		return sb.toString();
	}
	
	private static String outlineJson2(StringBuilder sb, String word, Font f, FontRenderContext frc, float pinchf) {
		Shape outline = f.createGlyphVector(frc, word).getOutline();
		// Area will convert to non-zero winding rule,
		// which is what HTML5 canvas can support
		double flatness = 0.1;
		
		float[] coords = new float[6];
		float minx = 0, maxx = 0, miny = 0, maxy = 0;
		{
			// each connected part, build an area
			// for subsequent parts, test if previous part
			// contained them.
			// if so, subtract them from previous; otherwise, create new
			int pointi = 0;
			for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
				assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
				final int type = pitr.currentSegment(coords);
				switch (type) {
					case PathIterator.SEG_CLOSE:
						break;
					case PathIterator.SEG_MOVETO:
						// Fall through to LINETO
					case PathIterator.SEG_LINETO:
						if (0 == pointi) {
							minx = coords[0];
							maxx = coords[0];
							miny = coords[1];
							maxy = coords[1];
						}
						else {
							if (coords[0] < minx) { minx = coords[0]; }
							else if (maxx < coords[0]) { maxx = coords[0]; }
							if (coords[1] < miny) { miny = coords[1]; }
							else if (maxy < coords[1]) { maxy = coords[1]; }
						}
						++pointi;
						break;
					case PathIterator.SEG_QUADTO:
					case PathIterator.SEG_CUBICTO:
					default:
						throw new IllegalStateException(String.format("Unknown segement type: %d", type));
				}
			}
		}
		
		// this should be a fixed percentage for both w and h
		// 
		final float bx = pinchf * (maxx - minx) / 2;
		final float by = pinchf * (maxy - miny) / 2;
		minx -= bx;
		maxx += bx;
		miny -= by;
		maxy += by;
		final float bleed = (maxy - miny) / 8.f;
		
		
//		StringBuilder sb = new StringBuilder(1024);
		sb.append("[");
		sb.append(minx).append(",").append(maxx)
		.append(",").append(miny).append(",").append(maxy)
		.append(", [");
		
		final Area env = new Area(new Rectangle2D.Float(minx, miny, maxx - minx, maxy - miny));
		
		GeneralPath accum = new GeneralPath();
		
		for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
			assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
			final int type = pitr.currentSegment(coords);
			switch (type) {
				case PathIterator.SEG_CLOSE:
					accum.closePath();
					env.subtract(new Area(accum));
					break;
				case PathIterator.SEG_MOVETO:
					accum.reset();
					accum.moveTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_LINETO:
					accum.lineTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_QUADTO:
				case PathIterator.SEG_CUBICTO:
				default:
					throw new IllegalStateException(String.format("Unknown segement type: %d", type));
			}
		}
		// Cut the area in half, along the y-axis
		final Area top = new Area(env);
		top.intersect(new Area(new Rectangle2D.Float(minx, miny, 
				maxx - minx, (maxy - miny) / 2.f + bleed)));
		final Area bottom = new Area(env);
		bottom.intersect(new Area(new Rectangle2D.Float(minx, (maxy + miny) / 2.f - bleed, 
				maxx - minx, (maxy - miny) / 2.f + bleed)));
		
		pts(false, sb, coords, flatness, largestArea(top, coords), 0, minx, maxx, miny, maxy);
		pts(false, sb, coords, flatness, largestArea(bottom, coords), 1, minx, maxx, miny, maxy);
		
		Area taken = new Area();
		taken.add(largestArea(top, coords));
		taken.add(largestArea(bottom, coords));
		Area inner = new Area(new Rectangle2D.Float(minx, miny, maxx - minx, maxy - miny));
		inner.exclusiveOr(taken);
		inner.subtract(new Area(outline));
		// The rest of the shapes left in 'inner' are holes
		pts(false, sb, coords, flatness, inner, 1, minx, maxx, miny, maxy);
		
		
//		largestPts(false, sb, coords, flatness, top, 0, minx, maxx, miny, maxy);
//		largestPts(false, sb, coords, flatness, bottom, 1, minx, maxx, miny, maxy);
//		pts(false, sb, coords, flatness, env, 0, minx, maxx, miny, maxy);
		
		sb.append("], []]");
		return sb.toString();
	}
	
	
	
	
	/**
	 * Double pass method.
	 */
	private static String outlineJson3(final String[] ws, int i0, int n, final Font f, final FontRenderContext frc) {
		StringBuilder sb = new StringBuilder(16 * 1024);
//		sb.append("outlines=new Array(").append(ws.length).append(");\n");
		for (int i = 0; i < n; ++i) {
			System.out.printf("Outlining %s ...\n", ws[i0 + i]);
			sb.append("/* ").append(ws[i0 + i]);
			sb.append("*/ outlines[").append(i0 + i).append("]=");
			outlineJson3(sb, ws[i0 + i].toUpperCase(), f, frc);
			sb.append(";\n");
		}
		return sb.toString();
	}
	private static String outlineJson3(StringBuilder sb, String word, Font f, FontRenderContext frc) {
		Shape outline = f.createGlyphVector(frc, word).getOutline();
		// Area will convert to non-zero winding rule,
		// which is what HTML5 canvas can support
		double flatness = 0.1;
		
		float[] coords = new float[6];
		float minx = 0, maxx = 0, miny = 0, maxy = 0;
		{
			// each connected part, build an area
			// for subsequent parts, test if previous part
			// contained them.
			// if so, subtract them from previous; otherwise, create new
			int pointi = 0;
			for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
				assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
				final int type = pitr.currentSegment(coords);
				switch (type) {
					case PathIterator.SEG_CLOSE:
						break;
					case PathIterator.SEG_MOVETO:
						// Fall through to LINETO
					case PathIterator.SEG_LINETO:
						if (0 == pointi) {
							minx = coords[0];
							maxx = coords[0];
							miny = coords[1];
							maxy = coords[1];
						}
						else {
							if (coords[0] < minx) { minx = coords[0]; }
							else if (maxx < coords[0]) { maxx = coords[0]; }
							if (coords[1] < miny) { miny = coords[1]; }
							else if (maxy < coords[1]) { maxy = coords[1]; }
						}
						++pointi;
						break;
					case PathIterator.SEG_QUADTO:
					case PathIterator.SEG_CUBICTO:
					default:
						throw new IllegalStateException(String.format("Unknown segement type: %d", type));
				}
			}
		}
		
		
		
//		StringBuilder sb = new StringBuilder(1024);
		sb.append("[");
		sb.append(minx).append(",").append(maxx)
		.append(",").append(miny).append(",").append(maxy)
		.append(", [");
		
		final Area env = new Area();
		
		GeneralPath accum = new GeneralPath();
		
		for (PathIterator pitr = outline.getPathIterator(null, flatness); ! pitr.isDone(); pitr.next()) {
			assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
			final int type = pitr.currentSegment(coords);
			switch (type) {
				case PathIterator.SEG_CLOSE:
					accum.closePath();
					env.add(new Area(accum));
					break;
				case PathIterator.SEG_MOVETO:
					accum.reset();
					accum.moveTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_LINETO:
					accum.lineTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_QUADTO:
				case PathIterator.SEG_CUBICTO:
				default:
					throw new IllegalStateException(String.format("Unknown segement type: %d", type));
			}
		}
		
		pts(false, sb, coords, flatness, env, 0, minx, maxx, miny, maxy);
		
		sb.append("], [");
		env.subtract(new Area(outline));
		// The rest of the shapes left in 'inner' are holes
		pts(true, sb, coords, flatness, env, 0, minx, maxx, miny, maxy);
		
		
//		largestPts(false, sb, coords, flatness, top, 0, minx, maxx, miny, maxy);
//		largestPts(false, sb, coords, flatness, bottom, 1, minx, maxx, miny, maxy);
//		pts(false, sb, coords, flatness, env, 0, minx, maxx, miny, maxy);
		
		sb.append("]]");
		return sb.toString();
	}
	
	
	
	static Area largestArea(Shape shape, float[] coords
	) {
		Area largest = null;
		GeneralPath accum = new GeneralPath();
		
		for (PathIterator pitr = shape.getPathIterator(null); ! pitr.isDone(); pitr.next()) {
			assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
			final int type = pitr.currentSegment(coords);
			switch (type) {
				case PathIterator.SEG_CLOSE:
					accum.closePath();
					if (null == largest || area(largest.getBounds2D()) < area(accum.getBounds2D())) {
						largest = new Area(accum);
					}
					break;
				case PathIterator.SEG_MOVETO:
					accum.reset();
					accum.moveTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_LINETO:
					accum.lineTo(coords[0], coords[1]);
					break;
				case PathIterator.SEG_QUADTO:
					accum.quadTo(coords[0], coords[1], coords[2], coords[3]);
					break;
				case PathIterator.SEG_CUBICTO:
					accum.curveTo(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);
					break;
				default:
					throw new IllegalStateException(String.format("Unknown segement type: %d", type));
			}
		}
		return largest;
	}
	private static float area(final Rectangle2D bounds) {
		return (float) (bounds.getWidth() * bounds.getHeight());
	}
	static void pts(boolean hole, StringBuilder sb, float[] coords, double flatness, Shape outline, int segi,
			float minx, float maxx, float miny, float maxy
	) {
		int pointi = 0;
		for (PathIterator pitr = outline.getPathIterator(null, flatness); !pitr.isDone(); pitr.next()) {
			assert pitr.getWindingRule() == PathIterator.WIND_NON_ZERO;
			final int type = pitr.currentSegment(coords);
			switch (type) {
				case PathIterator.SEG_CLOSE:
					sb.append("]");
					++segi;
					break;
				case PathIterator.SEG_MOVETO:
					if (0 < segi) { sb.append(","); }
//					sb.append("[").append(hole);
//					pointi = 1;
					sb.append("[");
					pointi = 0;
					// Fall through to LINETO
				case PathIterator.SEG_LINETO:
					if (0 < pointi) { sb.append(","); }
					sb.append((coords[0] - minx) / (maxx - minx));
					sb.append(",");
					sb.append((coords[1] - miny) / (maxy - miny));
					++pointi;
					break;
				case PathIterator.SEG_QUADTO:
				case PathIterator.SEG_CUBICTO:
				default:
					throw new IllegalStateException(String.format("Unknown segement type: %d", type));
			}
		}
	}

	/*
	static final float workingPrec = 0.001f;
	static final int workingPrecDigits = (int) Math.ceil(Math.log(1.f / workingPrec) / Math.log(10));
	static String prec(float f) {
		String p = String.valueOf(Math.round(f / workingPrec) * workingPrec);
		if (2 + workingPrecDigits < p.length()) {
			p = p.substring(0, 2 + workingPrecDigits);
		}
		return p;
	}
	*/
}
