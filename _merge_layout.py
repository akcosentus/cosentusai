#!/usr/bin/env python3
"""
Merge the header row and content row into a single two-column layout.
The header (avatar+name) moves into the left column alongside the description.
The right column (orb/status) now spans from the top.
"""
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # The pattern we need to transform for each agent:
    #
    # OLD:
    #   {/* Top Row: Header + Orb */}
    #   <div className="flex items-start justify-between">
    #     {/* Left: Avatar + Name */}
    #     <div className="flex items-center gap-5">
    #       <img ... />
    #       <div>
    #         <h3 ...>NAME</h3>
    #         <div className="inline-block">
    #           <p ...>SUBTITLE</p>
    #           <div ... blue line />
    #         </div>
    #       </div>
    #     </div>
    #
    #     </div>  (closing header row with possible extra whitespace)
    #   
    #   {/* Content: Description (left) + Orb/Status (right) */}
    #   <div className="flex items-center mt-2 mb-6 gap-8">
    #     {/* Left Half - Description */}
    #     <div className="w-1/2">
    #       <p ...>DESCRIPTION</p>
    #     </div>
    #
    #     {/* Right Half - Orb / Status */}
    #     <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
    #
    # NEW:
    #   {/* Two-Column Layout */}
    #   <div className="flex gap-8 mb-6">
    #     {/* Left Column - Header + Description */}
    #     <div className="w-1/2">
    #       <div className="flex items-center gap-5">
    #         <img ... />
    #         <div>
    #           <h3 ...>NAME</h3>
    #           <div className="inline-block">
    #             <p ...>SUBTITLE</p>
    #             <div ... blue line />
    #           </div>
    #         </div>
    #       </div>
    #       <p className="mt-4 text-gray-600 text-base leading-relaxed">DESCRIPTION</p>
    #     </div>
    #
    #     {/* Right Column - Orb / Status */}
    #     <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
    
    # Use regex to match and transform each agent section
    # Pattern matches from "{/* Top Row:" through to the right half opening div
    
    pattern = re.compile(
        r'(\s*)\{/\* Top Row: Header \+ Orb \*/\}\s*\n'
        r'\s*<div className="flex items-start justify-between">\s*\n'
        r'\s*\{/\* Left: Avatar \+ Name \*/\}\s*\n'
        r'(\s*<div className="flex items-center gap-5">\s*\n'   # avatar+name block start
        r'\s*<img\s*\n'
        r'\s*src="([^"]+)"\s*\n'                                 # capture avatar src
        r'\s*alt="([^"]+)"\s*\n'                                 # capture alt
        r'\s*className="w-20 h-20 rounded-full object-cover"\s*\n'
        r'\s*/>\s*\n'
        r'\s*<div>\s*\n'
        r'\s*<h3 className="text-4xl font-bold text-gray-900">([^<]+)</h3>\s*\n'  # capture name
        r'\s*<div className="inline-block">\s*\n'
        r'\s*<p className="text-lg text-gray-500 mt-1">([^<]+)</p>\s*\n'          # capture subtitle
        r'\s*<div className="mt-3 w-full h-\[2px\] bg-\[#01B2D6\]" />\s*\n'
        r'\s*</div>\s*\n'
        r'\s*</div>\s*\n'
        r'\s*</div>)\s*\n'                                       # end avatar+name block
        r'\s*\n?'
        r'\s*</div>\s*\n'                                        # close header row
        r'\s*\n?'
        r'\s*\{/\* Content: Description \(left\) \+ Orb/Status \(right\) \*/\}\s*\n'
        r'\s*<div className="flex items-center mt-2 mb-6 gap-8">\s*\n'
        r'\s*\{/\* Left Half - Description \*/\}\s*\n'
        r'\s*<div className="w-1/2">\s*\n'
        r'\s*<p className="text-gray-600 text-base leading-relaxed">\s*\n'
        r'\s*(.*?)\n'                                             # capture description text
        r'\s*</p>\s*\n'
        r'\s*</div>\s*\n'
        r'\s*\n?'
        r'\s*\{/\* Right Half - Orb / Status \*/\}\s*\n'
        r'\s*(<div className="w-1/2 flex flex-col items-center justify-center min-h-\[200px\]">)',  # capture right col opening
        re.DOTALL
    )
    
    def replacement(m):
        indent = m.group(1)
        avatar_src = m.group(3)
        avatar_alt = m.group(4)
        name = m.group(5)
        subtitle = m.group(6)
        description = m.group(7).strip()
        
        return f"""{indent}{{/* Two-Column Layout */}}
{indent}<div className="flex gap-8 mb-6">
{indent}  {{/* Left Column - Header + Description */}}
{indent}  <div className="w-1/2">
{indent}    <div className="flex items-center gap-5">
{indent}      <img 
{indent}        src="{avatar_src}" 
{indent}        alt="{avatar_alt}" 
{indent}        className="w-20 h-20 rounded-full object-cover"
{indent}      />
{indent}      <div>
{indent}        <h3 className="text-4xl font-bold text-gray-900">{name}</h3>
{indent}        <div className="inline-block">
{indent}          <p className="text-lg text-gray-500 mt-1">{subtitle}</p>
{indent}          <div className="mt-3 w-full h-[2px] bg-[#01B2D6]" />
{indent}        </div>
{indent}      </div>
{indent}    </div>
{indent}    <p className="mt-4 text-gray-600 text-base leading-relaxed">
{indent}      {description}
{indent}    </p>
{indent}  </div>

{indent}  {{/* Right Column - Orb / Status */}}
{indent}  <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">"""
    
    new_content = pattern.sub(replacement, content)
    
    if new_content == content:
        print(f"WARNING: No matches found in {filepath}!")
        # Try a simpler line-based approach
        new_content = fix_file_line_based(filepath, content)
    else:
        count = len(pattern.findall(content))
        print(f"Regex replaced {count} agent sections in {filepath}")
    
    with open(filepath, 'w') as f:
        f.write(new_content)

def fix_file_line_based(filepath, content):
    """Fallback: line-based transformation"""
    lines = content.split('\n')
    new_lines = []
    i = 0
    replacements = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Detect the start of a header block
        if '{/* Top Row: Header + Orb */}' in line:
            # Get the indentation
            indent = line[:len(line) - len(line.lstrip())]
            
            # Skip: {/* Top Row: Header + Orb */}
            i += 1
            # Skip: <div className="flex items-start justify-between">
            i += 1
            # Skip: {/* Left: Avatar + Name */}
            i += 1
            
            # Collect the avatar+name block (from <div flex items-center gap-5> to its closing </div>)
            avatar_name_lines = []
            # <div className="flex items-center gap-5">
            avatar_name_lines.append(lines[i])
            i += 1
            
            # Collect until we find the closing </div> for the avatar+name div
            # We need to track div depth
            depth = 1
            while i < len(lines) and depth > 0:
                l = lines[i].strip()
                if l.startswith('<div') and not l.endswith('/>'):
                    depth += 1
                if l == '</div>' or l.startswith('</div>'):
                    depth -= 1
                if depth > 0:
                    avatar_name_lines.append(lines[i])
                else:
                    avatar_name_lines.append(lines[i])  # closing </div>
                i += 1
            
            # Skip blank lines
            while i < len(lines) and lines[i].strip() == '':
                i += 1
            
            # Skip closing </div> of header row
            if i < len(lines) and '</div>' in lines[i].strip():
                i += 1
            
            # Skip blank lines
            while i < len(lines) and lines[i].strip() == '':
                i += 1
            
            # Skip: {/* Content: Description (left) + Orb/Status (right) */}
            if i < len(lines) and 'Content: Description' in lines[i]:
                i += 1
            
            # Skip: <div className="flex items-center mt-2 mb-6 gap-8">
            if i < len(lines) and 'flex items-center mt-2 mb-6 gap-8' in lines[i]:
                i += 1
            
            # Skip: {/* Left Half - Description */}
            if i < len(lines) and 'Left Half' in lines[i]:
                i += 1
            
            # Skip: <div className="w-1/2">
            if i < len(lines) and 'w-1/2' in lines[i].strip() and '<div' in lines[i]:
                i += 1
            
            # Collect description text
            desc_lines = []
            # Should be: <p className="text-gray-600 text-base leading-relaxed">
            if i < len(lines) and 'text-gray-600 text-base leading-relaxed' in lines[i]:
                i += 1  # skip the <p> opening tag
                
                # Collect text until </p>
                while i < len(lines) and '</p>' not in lines[i]:
                    desc_lines.append(lines[i].strip())
                    i += 1
                # Skip </p>
                if i < len(lines) and '</p>' in lines[i]:
                    i += 1
            
            # Skip: </div> (closing left half)
            while i < len(lines) and lines[i].strip() == '':
                i += 1
            if i < len(lines) and '</div>' in lines[i].strip():
                i += 1
            
            # Skip blank lines
            while i < len(lines) and lines[i].strip() == '':
                i += 1
            
            # Skip: {/* Right Half - Orb / Status */}
            if i < len(lines) and 'Right Half' in lines[i]:
                i += 1
            
            # Now we should be at: <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
            # We need to keep this line and everything after
            
            description = ' '.join(desc_lines)
            
            # Build new merged layout
            new_lines.append(f'{indent}{{/* Two-Column Layout */}}')
            new_lines.append(f'{indent}<div className="flex gap-8 mb-6">')
            new_lines.append(f'{indent}  {{/* Left Column - Header + Description */}}')
            new_lines.append(f'{indent}  <div className="w-1/2">')
            
            # Re-indent avatar+name lines
            for al in avatar_name_lines:
                new_lines.append(f'{indent}    {al.strip()}')
            
            new_lines.append(f'{indent}    <p className="mt-4 text-gray-600 text-base leading-relaxed">')
            new_lines.append(f'{indent}      {description}')
            new_lines.append(f'{indent}    </p>')
            new_lines.append(f'{indent}  </div>')
            new_lines.append(f'')
            new_lines.append(f'{indent}  {{/* Right Column - Orb / Status */}}')
            
            replacements += 1
            # Continue - the next line should be the right half div
            continue
        else:
            new_lines.append(line)
            i += 1
    
    print(f"Line-based replaced {replacements} agent sections in {filepath}")
    return '\n'.join(new_lines)


# Also need to remove the closing </div> that belonged to the old content row
# After the right column closes, we had:
#   </div>  ← close right column  
#   </div>  ← close content row (THIS NEEDS TO BECOME close of merged row)
# 
# Actually, the merged row uses the same </div> structure, so the closing divs stay the same.
# The old content row's </div> now becomes the merged row's </div>.

fix_file('/Users/alexkashkarian/Desktop/cosentusai/src/app/embed/voice/all-v2/page.tsx')
fix_file('/Users/alexkashkarian/Desktop/cosentusai/src/app/embed/voice/all/page.tsx')
print("Done!")
