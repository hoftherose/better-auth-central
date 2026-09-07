export function initialsFromName(name: string): string {
    return name
        .split(" ")
        .filter((part) => /^[a-z0-9]/i.test(part))
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

