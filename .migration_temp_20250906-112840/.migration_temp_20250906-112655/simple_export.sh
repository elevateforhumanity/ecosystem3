#!/usr/bin/env bash

echo "🚀 Creating export packages for your project..."

# Create exports directory
mkdir -p exports
TS="$(date +%Y%m%d-%H%M%S)"

# Function to create a tar.gz archive (more reliable than zip in some environments)
create_archive() {
  local name="$1"
  local source="$2"
  local output="exports/${name}-${TS}.tar.gz"
  
  echo "→ Creating: $output"
  
  # Create tar archive excluding common build/cache folders
  tar -czf "$output" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.next' \
    --exclude='.cache' \
    --exclude='coverage' \
    --exclude='*.log' \
    --exclude='.env*' \
    --exclude='.DS_Store' \
    --exclude='tmp' \
    "$source"
  
  # Show file size
  du -h "$output" | awk '{print "   size:", $1}'
}

echo "📦 Creating full project archive..."
create_archive "full-project" "."

echo "🔍 Looking for sister sites..."

# Look for potential site directories
sites=()
if [ -d "client" ]; then
  sites+=("client")
fi
if [ -d "server" ]; then
  sites+=("server")  
fi
if [ -d "shared" ]; then
  sites+=("shared")
fi

# Check for other potential sites
for dir in */; do
  dir=${dir%/}  # Remove trailing slash
  if [[ -f "$dir/package.json" ]] || [[ -f "$dir/index.html" ]] || [[ -f "$dir/vite.config.js" ]]; then
    if [[ ! "$dir" =~ ^(node_modules|dist|build|out|.git|exports)$ ]]; then
      sites+=("$dir")
    fi
  fi
done

# Remove duplicates
sites=($(printf "%s\n" "${sites[@]}" | sort -u))

if [ ${#sites[@]} -gt 0 ]; then
  echo "Found sites: ${sites[*]}"
  
  # Create individual archives for each site
  for site in "${sites[@]}"; do
    if [ -d "$site" ]; then
      create_archive "site-$site" "$site"
    fi
  done
  
  # Create combined archive of all sites
  echo "→ Creating combined sites archive"
  create_archive "all-sites-combined" "${sites[*]}"
else
  echo "No additional sites detected."
fi

echo ""
echo "✅ Export complete!"
echo "📁 Files created in exports/ directory:"
ls -lh exports/
echo ""
echo "💡 To download: Open Files panel → exports/ → right-click files → Download"