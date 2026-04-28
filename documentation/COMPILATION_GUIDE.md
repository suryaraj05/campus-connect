# Compilation Guide for Campus Connect Publication

## Prerequisites

To compile the LaTeX document, you need a LaTeX distribution installed:

### Windows
- Install [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/)

### macOS
- Install [MacTeX](https://www.tug.org/mactex/)

### Linux
```bash
sudo apt-get install texlive-full  # Ubuntu/Debian
sudo yum install texlive-scheme-full  # CentOS/RHEL
```

## Required LaTeX Packages

The document uses the following packages (usually included in full distributions):
- `amsmath`, `amsfonts`, `amssymb` - Mathematical symbols
- `graphicx` - Image inclusion
- `hyperref` - Hyperlinks
- `listings` - Code listings
- `xcolor` - Colors
- `geometry` - Page layout
- `float`, `caption`, `subcaption` - Figure/table positioning
- `booktabs`, `multirow` - Professional tables
- `algorithm`, `algpseudocode` - Algorithm pseudocode
- `enumitem` - List customization
- `cite` - Citations

## Compilation Steps

### Method 1: Command Line

1. Navigate to the documentation directory:
```bash
cd documentation
```

2. Compile the document:
```bash
pdflatex campus_connect_publication.tex
pdflatex campus_connect_publication.tex  # Run twice for references
```

### Method 2: Using an IDE

#### Overleaf (Online - Recommended)
1. Go to [Overleaf](https://www.overleaf.com/)
2. Create a new project
3. Upload `campus_connect_publication.tex`
4. Click "Recompile"

#### TeXstudio
1. Open `campus_connect_publication.tex` in TeXstudio
2. Click "Build & View" (F5)

#### VS Code with LaTeX Workshop Extension
1. Install "LaTeX Workshop" extension
2. Open the `.tex` file
3. Press `Ctrl+Alt+B` (Windows/Linux) or `Cmd+Option+B` (Mac)

## Customization

### Updating Author Information
Edit line 20-21 in the `.tex` file:
```latex
\author{Your Name\thanks{Corresponding author: your.email@university.edu}}
```

### Adding Figures
Place images in a `figures/` subdirectory and reference them:
```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{figures/system_architecture.png}
    \caption{System Architecture}
    \label{fig:architecture}
\end{figure}
```

### Adding References
Add entries to the `\begin{thebibliography}` section at the end of the document.

## Output

After successful compilation, you'll get:
- `campus_connect_publication.pdf` - The final document
- `campus_connect_publication.aux` - Auxiliary file (can be deleted)
- `campus_connect_publication.log` - Compilation log (can be deleted)

## Troubleshooting

### Missing Packages
If you get "Package not found" errors:
- MiKTeX: It will prompt to install missing packages automatically
- TeX Live: Run `sudo tlmgr install <package-name>`

### Bibliography Issues
If references don't appear:
- Run `pdflatex` twice
- Or use `bibtex` if you switch to BibTeX format

### Font Issues
If you see font warnings, they're usually non-critical. The document will still compile.

## Alternative: Markdown Version

If LaTeX compilation is problematic, use the markdown version:
- `campus_connect_publication.md` - Can be converted to PDF using:
  - [Pandoc](https://pandoc.org/): `pandoc campus_connect_publication.md -o output.pdf`
  - Online converters like [Dillinger](https://dillinger.io/)

