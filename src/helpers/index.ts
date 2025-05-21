class Helper {
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getFirstCharaterOfName(name: string): string {
    if (!name) return "";
    const nameParts = name.split(" ");
    const firstName = nameParts[nameParts.length - 1];
    return firstName.charAt(0).toUpperCase();
  }
}

const helper = new Helper();
export default helper;
